import type { IModalProps } from "../../Modal";
import { Modal } from "../../Modal";
import { tokenExpiryDateUnix } from "../utils";
import { ExpiredToken } from "./ExpiredToken";
import { useToken } from "../../../store/token";
import { WhoAmI } from "./WhoAmI";
import type { ReactElement } from "react";

const Content = ({ onValidate }: IProps): ReactElement => {
  const token = useToken();
  const millisRemaining = tokenExpiryDateUnix(token);
  if (millisRemaining < 0)
    return <ExpiredToken onClose={() => onValidate(false)} />;

  return <WhoAmI onValidate={onValidate} />;
};

interface IProps extends IModalProps {
  onValidate: (valid: boolean) => void;
}
export const ValidateTokenModal = (props: IProps): ReactElement => {
  return (
    <Modal {...props}>
      <Content {...props} />
    </Modal>
  );
};
