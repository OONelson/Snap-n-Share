import * as React from "react";
import { ReactNode } from "react";
import "./SmallModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { motion, spring } from "framer-motion";

interface IBigModalProps {
	show?: ()=> void;
	onClose: () => void;
	children: ReactNode;
}

const BigModal: React.FunctionComponent<IBigModalProps> = ({
	show,
	onClose,
	children
}) => {
	if (!show) return null;

	const modalVariants = {
		hidden: {
			opacity: 0,
			y: "70vw"
		},
		appear: {
			opacity: 1,
			y: 0,
			transition: {
				// duration: 0.5,
				type: spring,
				stiffness: 80
			}
		}
	};

	const backFaceVariants = {
		hidden: {
			opacity: 0
		},
		appear: {
			opacity: 1,

			transition: {
				staggerChildren: 0.5,
				duration: 0.3,
				type: spring,
				stiffness: 100
			}
		}
	};

	return (
		<motion.div
			variants={backFaceVariants}
			initial="hidden"
			animate="appear"
			className="modal-backdrop"
			onClick={onClose}
		>
			<motion.div
				variants={modalVariants}
				initial="hidden"
				animate="appear"
				exit={{ y: "-75vw" }}
				className="modal-content"
				onClick={(e) => e.stopPropagation()}
			>
				<FontAwesomeIcon
					className="modal-close -mt-2 -mr-1"
					onClick={onClose}
					icon={faTimes}
				/>

				{children}
			</motion.div>
		</motion.div>
	);
};

export default BigModal;
