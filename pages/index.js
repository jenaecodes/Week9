import React from 'react'
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import Header from '../components/Header'
import DemoPageLinks from '../components/DemoPageLinks'
import Header2 from '../components/Header2'

const styles = {
  content: {
    padding: 32,
  },
  infoTextContainer: {
    marginBottom: 32,
  },
}

const Demo = () => {
  const AuthUser = useAuthUser()
  return (
    <div>
        <Header2
        email={AuthUser.email} 
        signOut={AuthUser.signOut} />
        <div style={styles.content}>
        <div style={styles.infoTextContainer}>
          <h3>Welcome!</h3>
          <p>
            Sign-in and choose from the options above
          </p>
          
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = withAuthUserTokenSSR()()

export default withAuthUser()(Demo)