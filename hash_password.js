const bcrypt = require('bcryptjs');

const passwordToHash = 'thermo2024'; // Esta é a senha que você usará no login do frontend

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(passwordToHash, salt, (err, hash) => {
        if (err) {
            console.error('Erro ao gerar hash:', err);
            return;
        }
        console.log('O hash da sua senha é:');
        console.log(hash);
    });
});