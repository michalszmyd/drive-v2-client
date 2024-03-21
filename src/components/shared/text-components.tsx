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

export function H2({children}: {children: string | React.ReactElement}) {
  return (
    <h2 className={styles.h2}>
      <Text>{children}</Text>
    </h2>
  )
}

const styles = {
  h1: css({
    fontSize: '24px',
    fontWeight: 200,
    marginTop: 0,
  }),
  h2: css({
    fontSize: '16px',
    fontWeight: 200,
    marginTop: 0,
  }),
}
