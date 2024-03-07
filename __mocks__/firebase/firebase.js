import firebasemock from 'firebase-mock'
import MockFirestoreQuery from 'firebase-mock/src/firestore-query'

const mockdatabase = new firebasemock.MockFirebase()
const mockauth = new firebasemock.MockFirebase()
const mocksdk = new firebasemock.MockFirebaseSdk(
  (path) => (path ? mockdatabase.child(path) : mockdatabase),
  () => mockauth
)

export default mocksdk
