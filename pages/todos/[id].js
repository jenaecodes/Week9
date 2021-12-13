import { Flex, Heading, Text, VStack, Link, Input,
        Button } from "@chakra-ui/react";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth';
import { getFirebaseAdmin } from 'next-firebase-auth';
import Header2 from "../../components/Header2";
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useState, useEffect } from "react";

const SingleTodo = ({itemData}) => {
  const AuthUser = useAuthUser();
  const [inputName, setInputName] = useState(itemData.name);
  const [statusMsg, setStatusMsg] = useState('Update');

  const sendData = async () => {
    try{
      //trying to update the document
      const docRef = await firebase.firestore().collection("todos").doc(itemData.id);
      const doc = docRef.get();

      if(!doc.empty){
        //since this is going to the DB, field name has to match the one used in the DB
        docRef.update(
          {
            todo: inputName
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
            {itemData.name}
          </Heading>
        </VStack>

      </Flex>
      <Flex justifyContent="center">
        <Input type="text" value={inputName} onChange={(e) => setInputName(e.target.value)} placeholder="Event Title" />
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
    const doc = await db.collection("todos").doc(params.id).get();

    let itemData;
    if(!doc.empty){
      //document found
      let docData = doc.data();
      itemData = {
        id: doc.id,
        name: docData.todo,
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
)(SingleTodo)