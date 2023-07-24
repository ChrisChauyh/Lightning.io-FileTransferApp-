export const handleDownload = (prop) => {
    // Make a request to the backend download endpoint
    fetch(`download/${prop.downloadLink}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob(); // Convert the response to a Blob
        })
        .then(blob => {
            // Create a URL for the Blob object
            const url = URL.createObjectURL(blob);

            // Create a temporary link element to trigger the download
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = prop.name; // Set the desired filename and extension
            downloadLink.click(); // Simulate a click on the link to trigger the download

            // Clean up the temporary URL object after the download is initiated
            URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle errors, e.g., display an error message to the user
        });
};
//create a function to delete a file
export const handleDelete = (prop, onDeleteSuccess) => {
    // Make a request to the backend delete endpoint
    fetch(`delete/${prop.downloadLink}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json', // You may need to adjust the content type based on your backend requirements
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            onDeleteSuccess();
            // You can optionally do something here after the deletion is successful
            console.log('Record deleted successfully!');
        })
        .catch(error => {
            // Handle any errors that occurred during the delete request
            console.error('Error deleting record:', error);
        });
}
