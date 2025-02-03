import { auth, db } from "@/firebase/firebaseConfig";
import { sendEmailVerification } from 'firebase/auth'
import { v4 as uuidv4 } from 'uuid';
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import * as React from "react";
import { useEffect, useState } from "react";

interface IChangeEmailPageProps {}

const ChangeEmailPage: React.FunctionComponent<IChangeEmailPageProps> = (
  
) => {
    const [newEmail, setNewEmail] = useState<string>('');
    const [isChanging, setIsChangingEmail] = useState<boolean>(false);
    const [confirmation, setConfirmation] = useState('');
    const [error, setError] = useState('');

    const user = auth.currentUser;
    
    useEffect(() => {
        if (user) {
            const userRef = collection(db, 'users', user.uid);

            getDoc(doc(userRef));


        }
    }, [user]);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewEmail(e.target.value);
    }

    const handleConfirmationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmation(e.target.value);
        
    }

    const handleSendEmailConfirmation = async () => {
    try {
        const generatedCode = uuidv4()
        
        if (user) {
            await updateDoc(doc(db, 'users', user.uid), {
                emailConfirmationCode: generatedCode
            });
        }
    } catch (error) {
        
    }
}

    
    return (
      
  )
};

export default ChangeEmailPage;
