import { Flex, Heading, Text, VStack, Link, 
        Input, Button} from "@chakra-ui/react";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth';
import { getFirebaseAdmin } from 'next-firebase-auth';
import Header2 from "../../components/Header2";
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useState, useEffect } from "react";


const SingleEvent = ({itemData}) => {
  const AuthUser = useAuthUser()
  const [inputName, setInputName] = useState(itemData.name);
  const [inputDate, setInputDate] = useState(itemData.date);
  const [statusMsg, setStatusMsg] = useState('Update');


  const sendData = async () => {
    try{
      //trying to update the document
      const docRef = await firebase.firestore().collection("events").doc(itemData.id);
      const doc = docRef.get();

      //inputting a date object while ignoring UTC offset of local timezone

      //temporary Date object to hold inputDate
      let DateTemp = (new Date(inputDate));
      //use this new object to redefine the variable into an object with the UTC time
      let inputDateUTC = new Date(
        DateTemp.getUTCFullYear(),
        DateTemp.getUTCMonth(),
        DateTemp.getUTCDate()
        );



      if(!doc.empty){
        //since this is going to the DB, field name has to match the one used in the DB
        docRef.update(
          {
            name: inputName,
            date: firebase.firestore.Timestamp.fromDate(inputDateUTC)
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
      <Input type="date" value={inputDate} onChange={(e) => setInputDate(e.target.value)} placeholder="Event Date" />
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
    const doc = await db.collection("events").doc(params.id).get();

    let itemData;
    if(!doc.empty){
      //document found
      let docData = doc.data();
      itemData = {
        id: doc.id,
        name: docData.name,
        date: docData.date.toDate().toDateString()
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
)(SingleEvent)