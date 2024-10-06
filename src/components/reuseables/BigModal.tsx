import * as React from "react";
import { ReactNode } from "react";
import "./SmallModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface IBigModalProps {
	show: boolean;
	onClose: () => void;
	children: ReactNode;
}

const BigModal: React.FunctionComponent<IBigModalProps> = ({
	show,
	onClose,
	children,
}) => {
	if (!show) return null;

	return (
		<div className="modal-backdrop" onClick={onClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<FontAwesomeIcon
					className="modal-close -mt-2 -mr-1"
					onClick={onClose}
					icon={faTimes}
				/>

				{children}
			</div>
		</div>
	);
};

export default BigModal;
