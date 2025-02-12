const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = '3000';

app.use(bodyParser.json());

const folderPath = 'D:/practicSharov/fsApp/dataFile';

app.get('/files', (req, res) => {
    if (!fs.existsSync(folderPath)) return res.status(404).send('Указанная папка не существует');

    fs.readdir(folderPath, (err, files) => {
        if (err) return res.status(500).send('Ошибка при чтении папки');

        const fileList = files.filter(file => {
            const filePath = path.join(folderPath, file);
            return fs.statSync(filePath).isFile();
        });

        res.json(fileList);
    });
});

app.get('/file', (req, res) => {
    const fileName = req.query.name;

    if (!fileName) return res.status(400).send('Не указано имя файла');

    const filePath = path.join(folderPath, fileName);

    if (!fs.existsSync(filePath)) return res.status(404).send('Файл не существует');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Ошибка при чтении файла');
        res.json({ content: data });
    });
});

app.post('/file', (req, res) => {
    const fileName = req.body.name;
    const content = req.body.content;

    if (!fileName || !content) return res.status(400).send('Не указано имя файла или содержимое');

    const filePath = path.join(folderPath, fileName);

    fs.writeFile(filePath, content, 'utf8', (err) => {
        if (err) return res.status(500).send('Ошибка при сохранении файла');
        res.send('Файл успешно сохранен');
    });
});

app.delete('/file', (req, res) => {
    const fileName = req.body.name;

    if (!fileName) return res.status(400).send('Не указано имя файла');

    const filePath = path.join(folderPath, fileName);

    if (!fs.existsSync(filePath)) return res.status(404).send('Файл не существует');

    fs.unlink(filePath, (err) => {
        if (err) return res.status(500).send('Ошибка при удалении файла');
        res.send('Файл успешно удален');
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});

//GET http://localhost:3000/files?path=D:/practic Sharov/fsApp/dataFile/ - на все файлы в папке запрос
//GET http://localhost:3000/file?path=D:/practic Sharov/fsApp/dataFile/example.json - на конкретный файл