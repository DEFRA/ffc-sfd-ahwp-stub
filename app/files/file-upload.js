document.getElementById('uploadForm').addEventListener('submit', async (event) => {
  event.preventDefault()

  const form = event.target
  const formData = new FormData(form)

  try {
      const response = await fetch('http://localhost:3019/upload', {
          method: 'POST',
          body: formData
      })

      const result = await response.json()
      document.getElementById('result').innerText = JSON.stringify(result, null, 2)
  } catch (error) {
      console.error('Error uploading files:', error)
      document.getElementById('result').innerText = 'Error uploading files'
  }
})