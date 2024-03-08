import useJournalStore from './useJournalStore'

// describe('useJournalStore', () => {
//   beforeEach(() => {
//     // Reset the store to its initial state before each test to avoid state leakage between tests
//     act(() => useJournalStore.setState({ journals: [] }, true))
//   })

//   it('should upload a journal image and return the URL', async () => {
//     const userId = 'user1'
//     const imageUri = 'path/to/local/image.jpg'
//     const imageUrl = await useJournalStore
//       .getState()
//       .uploadJournalImage(userId, imageUri)

//     expect(imageUrl).toEqual('https://example.com/uploaded-image.jpg')
//   })

//   it('should fetch journals for a user', async () => {
//     const userId = 'user1'
//     await act(() => useJournalStore.getState().fetchJournals(userId))

//     const journals = useJournalStore.getState().journals
//     expect(journals.length).toBeGreaterThan(0)
//     expect(journals[0].id).toBeDefined()
//     expect(journals[0].title).toBeDefined()
//   })

//   it('should add a new journal entry', async () => {
//     const userId = 'user1'
//     const newJournal = {
//       title: 'New Journal Entry',
//       description: 'Description of the new entry',
//       date: new Date(),
//       imageUri: 'path/to/new/image.jpg',
//     }

//     await act(() => useJournalStore.getState().addJournal(userId, newJournal))

//     const journals = useJournalStore.getState().journals
//     expect(journals.length).toBeGreaterThan(0)
//     expect(
//       journals.some((journal) => journal.title === newJournal.title)
//     ).toBeTruthy()
//   })

//   it('should delete a journal entry', async () => {
//     const userId = 'user1'
//     const journalIdToDelete = '1' // Assuming this ID exists from your dummy data

//     await act(() =>
//       useJournalStore.getState().deleteJournal(userId, journalIdToDelete)
//     )

//     const journals = useJournalStore.getState().journals
//     expect(
//       journals.some((journal) => journal.id === journalIdToDelete)
//     ).toBeFalsy()
//   })

//   it('should edit a journal entry', async () => {
//     const userId = 'user1'
//     const journalIdToEdit = '2' // Assuming this ID exists from your dummy data
//     const updatedJournalData = {
//       title: 'Updated Journal Title',
//       description: 'Updated description',
//       // No need to update date or imageUrl for this test
//     }

//     await act(() =>
//       useJournalStore
//         .getState()
//         .editJournal(userId, journalIdToEdit, updatedJournalData)
//     )

//     const journals = useJournalStore.getState().journals
//     const updatedJournal = journals.find(
//       (journal) => journal.id === journalIdToEdit
//     )
//     expect(updatedJournal).toBeDefined()
//     expect(updatedJournal.title).toEqual(updatedJournalData.title)
//     expect(updatedJournal.description).toEqual(updatedJournalData.description)
//   })

//   it('should fetch a single journal entry', async () => {
//     const userId = 'user1'
//     const journalId = '1' // Assuming this ID exists

//     const journal = await useJournalStore
//       .getState()
//       .fetchSingleJournal(userId, journalId)

//     expect(journal).toBeDefined()
//     expect(journal.id).toEqual(journalId)
//     expect(journal.title).toBeDefined()
//   })
// })
