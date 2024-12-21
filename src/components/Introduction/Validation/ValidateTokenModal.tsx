import type { IModalProps } from "../../Modal";
import { Modal } from "../../Modal";
import { tokenExpiryDateUnix } from "../utils";
import { ExpiredToken } from "./ExpiredToken";
import { useToken } from "../../../store/token";
import { WhoAmI } from "./WhoAmI";
import type { ReactElement } from "react";

const Content = ({
  onValidate,
  onClose,
}: ValidateTokenModalProps): ReactElement => {
  const token = useToken();
  const millisRemaining = tokenExpiryDateUnix(token);
  if (millisRemaining < 0) return <ExpiredToken onClose={onClose} />;

  return <WhoAmI onClose={onClose} onValidate={onValidate} />;
};

interface ValidateTokenModalProps extends IModalProps {
  onValidate: () => void;
}

export const ValidateTokenModal = (
  props: ValidateTokenModalProps,
): ReactElement => {
  return (
    <Modal {...props}>
      <Content {...props} />
    </Modal>
  );
};
