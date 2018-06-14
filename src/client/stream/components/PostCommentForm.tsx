import { Localized } from "fluent-react/compat";
import * as React from "react";
import { StatelessComponent } from "react";
import { Field, Form } from "react-final-form";

import { required } from "talk-framework/lib/validation";
import { Button } from "talk-ui/components";

import * as styles from "./PostCommentForm.css";

export interface PostCommentFormProps {
  onSubmit: (input: { body: string }) => void;
}

const PostCommentForm: StatelessComponent<PostCommentFormProps> = props => (
  <Form onSubmit={props.onSubmit}>
    {({ handleSubmit, submitting, invalid }) => (
      <form autoComplete="off" onSubmit={handleSubmit}>
        <Field name="body" validate={required}>
          {({ input, meta }) => (
            <textarea
              className={styles.textarea}
              name={input.name}
              onChange={input.onChange}
              value={input.value}
            />
          )}
        </Field>
        <Localized id="stream-postCommentForm-submit">
          <Button
            className={styles.postButton}
            disabled={submitting || invalid}
            primary
          >
            Post
          </Button>
        </Localized>
      </form>
    )}
  </Form>
);

export default PostCommentForm;
