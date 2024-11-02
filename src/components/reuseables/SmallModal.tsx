import * as React from "react";
import { ReactNode } from "react";
import "./SmallModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion, spring } from "framer-motion";

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

	const modalVariants = {
		hidden: {
			opacity: 0,
			y: "70vw"
		},
		appear: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
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
		<AnimatePresence mode="wait">
			<motion.div
				variants={backFaceVariants}
				initial="hidden"
				animate="appear"
				exit="hidden"
				className="modal-backdrop"
				onClick={onClose}
			>
				<motion.div
					variants={modalVariants}
					initial="hidden"
					animate="appear"
					exit="hidden"
					className="modal-content border-t-2 border-gray-400"
					onClick={(e) => e.stopPropagation()}
				>
					<FontAwesomeIcon
						className="modal-close"
						onClick={onClose}
						icon={faTimes}
					/>

					{children}
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};

export default SmallModal;
