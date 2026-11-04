import { Col, Input, InputNumber, Modal, Row, Switch, Typography } from "antd";
import { useEffect, useState } from "react";
import type { BikeModel, CreateBikeModel } from "../models/BikeModel";

interface BikeFormModalProps {
  open: boolean;
  title: string;
  okText: string;
  // Present when editing: the form starts with the values of this bike.
  // Absent when creating: the form starts empty.
  initialBike?: BikeModel;
  onClose: () => void;
  // Returns the request so the modal can stay open and show an error if it fails
  onSubmit: (input: CreateBikeModel) => Promise<void>;
}

type TextField =
  | "brand"
  | "model"
  | "category"
  | "frameMaterial"
  | "description";
// The price is typed in euros in the form and converted to cents on submit
type NumberField =
  | "frameSizeCm"
  | "wheelSizeInches"
  | "gearCount"
  | "weightKg"
  | "priceEuros";

// Form state: texts are strings, numbers are `number | null` (null = empty field)
type BikeFormValues = Record<TextField, string> &
  Record<NumberField, number | null> & { electric: boolean };

type BikeFormErrors = Partial<Record<TextField | NumberField, string>>;

const emptyValues: BikeFormValues = {
  brand: "",
  model: "",
  category: "",
  frameMaterial: "",
  description: "",
  frameSizeCm: null,
  wheelSizeInches: null,
  gearCount: null,
  weightKg: null,
  priceEuros: null,
  electric: false,
};

// Bike (API) -> form values
const toValues = (bike: BikeModel): BikeFormValues => ({
  brand: bike.brand,
  model: bike.model,
  category: bike.category,
  frameMaterial: bike.frameMaterial,
  description: bike.description,
  frameSizeCm: bike.frameSizeCm,
  wheelSizeInches: bike.wheelSizeInches,
  gearCount: bike.gearCount,
  weightKg: bike.weightKg,
  // The form works in euros, the API in cents
  priceEuros: bike.priceCents / 100,
  electric: bike.electric,
});

const isPositive = (value: number | null) => value !== null && value > 0;

// Client-side validation, same rules as the API (so the user gets instant
// feedback). The API still validates everything on its side.
const validate = (values: BikeFormValues): BikeFormErrors => {
  const errors: BikeFormErrors = {};
  if (!values.brand.trim()) errors.brand = "Brand is required";
  if (!values.model.trim()) errors.model = "Model is required";
  if (!values.category.trim()) errors.category = "Category is required";
  if (!values.frameMaterial.trim())
    errors.frameMaterial = "Frame material is required";
  if (!isPositive(values.frameSizeCm))
    errors.frameSizeCm = "Must be greater than 0";
  if (!isPositive(values.wheelSizeInches))
    errors.wheelSizeInches = "Must be greater than 0";
  if (!isPositive(values.weightKg)) errors.weightKg = "Must be greater than 0";
  // The number of gears must be a whole number >= 1
  if (
    values.gearCount === null ||
    !Number.isInteger(values.gearCount) ||
    values.gearCount < 1
  )
    errors.gearCount = "Must be a whole number, at least 1";
  // A price of 0 is allowed (same as the API), a negative one is not
  if (values.priceEuros === null || values.priceEuros < 0)
    errors.priceEuros = "Must be 0 or more";
  return errors;
};

// Form values -> body sent to the API.
// Called only after validate(), so the numbers are never null here.
const toCreateBikeModel = (values: BikeFormValues): CreateBikeModel => ({
  brand: values.brand.trim(),
  model: values.model.trim(),
  category: values.category.trim(),
  frameMaterial: values.frameMaterial.trim(),
  description: values.description.trim(),
  frameSizeCm: Number(values.frameSizeCm),
  wheelSizeInches: Number(values.wheelSizeInches),
  gearCount: Number(values.gearCount),
  weightKg: Number(values.weightKg),
  electric: values.electric,
  // Math.round avoids floating point issues: 19.99 * 100 = 1998.9999999999998
  priceCents: Math.round(Number(values.priceEuros) * 100),
});

export const BikeFormModal = ({
  open,
  title,
  okText,
  initialBike,
  onClose,
  onSubmit,
}: BikeFormModalProps) => {
  const [values, setValues] = useState<BikeFormValues>(emptyValues);
  const [errors, setErrors] = useState<BikeFormErrors>({});
  // Error returned by the API (network error, 400...), shown under the form
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Every time the modal opens, start again from the bike (edit) or from an
  // empty form (create). This discards what was typed before a cancel.
  useEffect(() => {
    if (!open) return;
    setValues(initialBike ? toValues(initialBike) : emptyValues);
    setErrors({});
    setSubmitError(null);
  }, [open]);

  const onConfirm = () => {
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setSubmitError(null);
    // Invalid form: show the errors and do not call the API
    if (Object.keys(validationErrors).length > 0) return;

    setIsSaving(true);
    onSubmit(toCreateBikeModel(values))
      .then(onClose) // success: close the modal
      // On failure, stay open so the user does not lose what was typed
      .catch(() =>
        setSubmitError("The bike could not be saved. Please try again."),
      )
      .finally(() => setIsSaving(false));
  };

  // Renders a labelled text input with its error message
  const textField = (name: TextField, label: string) => (
    <>
      <label htmlFor={`bike-${name}`}>{label}</label>
      <Input
        id={`bike-${name}`}
        value={values[name]}
        status={errors[name] && "error"}
        onChange={(event) => {
          setValues({ ...values, [name]: event.target.value });
          // Clear the error of this field as soon as the user edits it
          setErrors({ ...errors, [name]: undefined });
        }}
      />
      {errors[name] && (
        <Typography.Text type="danger">{errors[name]}</Typography.Text>
      )}
    </>
  );

  // Renders a labelled number input with its error message
  const numberField = (
    name: NumberField,
    label: string,
    options: { step?: number; precision?: number } = {},
  ) => (
    <>
      <label htmlFor={`bike-${name}`}>{label}</label>
      <InputNumber
        id={`bike-${name}`}
        style={{ width: "100%" }}
        value={values[name]}
        step={options.step}
        precision={options.precision}
        status={errors[name] && "error"}
        onChange={(value) => {
          setValues({ ...values, [name]: value });
          setErrors({ ...errors, [name]: undefined });
        }}
      />
      {errors[name] && (
        <Typography.Text type="danger">{errors[name]}</Typography.Text>
      )}
    </>
  );

  return (
    <Modal
      open={open}
      title={title}
      okText={okText}
      onCancel={onClose}
      onOk={onConfirm}
      confirmLoading={isSaving}
      width={640}
    >
      <Row gutter={[16, 16]}>
        <Col span={12}>{textField("brand", "Brand *")}</Col>
        <Col span={12}>{textField("model", "Model *")}</Col>
        <Col span={12}>{textField("category", "Category *")}</Col>
        <Col span={12}>{textField("frameMaterial", "Frame material *")}</Col>
        <Col span={8}>
          {numberField("frameSizeCm", "Frame size (cm) *", { step: 1 })}
        </Col>
        <Col span={8}>
          {numberField("wheelSizeInches", "Wheel size (in) *", { step: 1 })}
        </Col>
        <Col span={8}>{numberField("gearCount", "Gears *", { step: 1 })}</Col>
        <Col span={8}>
          {numberField("weightKg", "Weight (kg) *", { step: 0.1 })}
        </Col>
        <Col span={8}>
          {numberField("priceEuros", "Price (€) *", {
            step: 10,
            precision: 2,
          })}
        </Col>
        <Col span={8}>
          <label htmlFor="bike-electric">Electric</label>
          <div>
            <Switch
              id="bike-electric"
              checked={values.electric}
              onChange={(electric) => setValues({ ...values, electric })}
            />
          </div>
        </Col>
        {/* The description is optional: it can be empty */}
        <Col span={24}>
          <label htmlFor="bike-description">Description</label>
          <Input.TextArea
            id="bike-description"
            rows={3}
            value={values.description}
            onChange={(event) =>
              setValues({ ...values, description: event.target.value })
            }
          />
        </Col>
        {submitError && (
          <Col span={24}>
            <Typography.Text type="danger">{submitError}</Typography.Text>
          </Col>
        )}
      </Row>
    </Modal>
  );
};