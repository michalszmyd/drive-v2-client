import { Collapse } from "antd";

export default function FileMetadataText({text}: {text: string | null}) {
  if (!text) {
    return null;
  }

  return (
    <Collapse defaultActiveKey={[]}>
      <Collapse.Panel header="Image Text" key="1">
        <p>{text}</p>
      </Collapse.Panel>
    </Collapse>
  )

}
