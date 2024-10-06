import * as React from "react";
import { ReactNode } from "react";
import "./SmallModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface ISmallModalProps {
	show: boolean;
	onClose: () => void;
	children: ReactNode;
}

const SmallModal: React.FunctionComponent<ISmallModalProps> = ({
	show,
	onClose,
	children
}) => {
	if (!show) return null;

	return (
		<div className="modal-backdrop" onClick={onClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<FontAwesomeIcon
					className="modal-close"
					onClick={onClose}
					icon={faTimes}
				/>

				{children}
			</div>
		</div>
	);
};

export default SmallModal;
