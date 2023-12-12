import { css } from "@emotion/css"
import Text from "./text"
import React from "react"

export function H1({children}: {children: string | React.ReactElement}) {
  return (
    <h1 className={styles.h1}>
      <Text>{children}</Text>
    </h1>
  )
}

const styles = {
  h1: css({
    fontSize: '24px',
  }),
}
