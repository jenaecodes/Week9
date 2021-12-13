import { Flex, Heading, Text, VStack, Link,
        Input, Button } from "@chakra-ui/react";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth';
import { getFirebaseAdmin } from 'next-firebase-auth';
import Header2 from "../../components/Header2";
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useState, useEffect } from "react";


const SingleContact = ({itemData}) => {
  const AuthUser = useAuthUser();
  const [inputFirstName, setInputFirstName] = useState(itemData.firstName);
  const [inputLastName, setInputLastName] = useState(itemData.lastName);
  const [inputPhone, setInputPhone] = useState(itemData.phone);
  const [inputEmail, setInputEmail] = useState(itemData.email);

  const [statusMsg, setStatusMsg] = useState('Update');

  const sendData = async () => {
    try{
      //trying to update the document
      const docRef = await firebase.firestore().collection("contacts").doc(itemData.id);
      const doc = docRef.get();

      if(!doc.empty){
        //since this is going to the DB, field name has to match the one used in the DB
        docRef.update(
          {
            firstName: inputFirstName,
            lastName: inputLastName,
            phone: inputPhone,
            email: inputEmail
          }
        );
        setStatusMsg("Updated!")
      }

    } catch(error) {
      console.log(error);
    }
  }



  return (
    <>
      <Flex>
        <VStack w="full">
          <Header2
          email={AuthUser.email} 
          signOut={AuthUser.signOut} />
          
          <Heading>
            {itemData.firstName} {itemData.lastName}
          </Heading>
        </VStack>

      </Flex>
      <Flex justifyContent="center">
      <Input type="text" value={inputFirstName} onChange={(e) => setInputFirstName(e.target.value)} placeholder="First Name" />
      <Input type="text" value={inputLastName} onChange={(e) => setInputLastName(e.target.value)} placeholder="Last Name" />
      </Flex>


      <Flex justifyContent="center">
      <Input type="tel" value={inputPhone} onChange={(e) => setInputPhone(e.target.value)} placeholder="phone number" />
      <Input type="email" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} placeholder="email address" />


      </Flex>

      <Flex justifyContent="center">

      <Button
            ml={2}
            onClick={() => sendData()}
          >
            {statusMsg}
        </Button>
      </Flex>

    </>
  );
};

export const getServerSideProps = withAuthUserTokenSSR(
  {
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
  }
)(
  async ({ AuthUser, params}) => {
    // get id from url and make a db query
    const db = getFirebaseAdmin().firestore();
    const doc = await db.collection("contacts").doc(params.id).get();

    let itemData;
    if(!doc.empty){
      //document found
      let docData = doc.data();
      itemData = {
        id: doc.id,
        firstName: docData.firstName, 
        lastName: docData.lastName,
        phone: docData.phone,
        email: docData.email,

      };
    } else {
      //no docs found
      itemData = null;
    }
    // return data
    return{
      props: {
        itemData
      }
    }
  }
)

export default withAuthUser(
  {
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    whenUnauthedBeforeInit: AuthAction.REDIRECT_TO_LOGIN,
  }
)(SingleContact)