const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Koneksi database berhasil terhubung.');
    app.listen(PORT, () => {
      console.log('Server berjalan pada port ' + PORT);
    });
  })
  .catch(err => console.log('Database gagal terhubung:', err));