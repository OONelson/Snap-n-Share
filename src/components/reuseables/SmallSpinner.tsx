import * as React from "react";
import { Icons } from "../ui/Icons";
import "./SmallSpinner.css";

interface ISmallSpinnerProps {}

const SmallSpinner: React.FunctionComponent<ISmallSpinnerProps> = () => {
	return <Icons.spinner className="Spinner"></Icons.spinner>;
};

export default SmallSpinner;
