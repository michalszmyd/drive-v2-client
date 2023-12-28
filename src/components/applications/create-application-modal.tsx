import { Input, Modal, Row } from "antd";
import ApplicationModel from "../../models/application-model";
import { useState } from "react";

export default function CreateApplicationModal({
  open,
  onCancel,
  onSubmit,
}: {
  open: boolean;
  onCancel: () => void;
  onSubmit: (application: ApplicationModel) => void;
}) {
  const [application, setApplication] = useState<ApplicationModel>(new ApplicationModel());

  const onChange = ({target: {name, value}}: {target: {name: string; value: string}}) => {
    setApplication((state) => {
      const updatedModel = new ApplicationModel()
      updatedModel.assignAttributes({...state});
      updatedModel[name] = value;

      return updatedModel;
    })
  };

  const onConfirm = () => {
    onSubmit(application);
    setApplication(new ApplicationModel());
  }

  return (
    <Modal onOk={onConfirm} title="Create Application API" open={open} onCancel={onCancel}>
      <form>
        <Row gutter={[8, 8]}>
          <Input
            name="name"
            placeholder="Application name"
            value={application.name}
            onChange={onChange}
          />
          <Input
            name="description"
            placeholder="Application description (optional)"
            value={application.description}
            onChange={onChange}
          />
        </Row>
      </form>
    </Modal>
  )
}
