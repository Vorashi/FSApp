const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = '3000';

app.use(express.static(__dirname + '/dataFile'));

//http://localhost:3000/files?path=/path/to/your/folder
app.get('/folder', (req, res)=> {
    const folderPath = req.query.path;

    if (!folderPath) return res.status(400).send('Не указан путь к папке');
    if (!fs.existsSync(folderPath)) return res.status(404).send('Указанная папка не существует');
    // fs.readdirSync(__dirname + '/dataFile', (err, files) => {
    //     res.end(files);
    // });
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            return res.status(500).send('Ошибка при чтении папки');
        }

        // Фильтруем только файлы, исключая директории
        const fileList = files.filter(file => {
            const filePath = path.join(folderPath, file);
            return fs.statSync(filePath).isFile();
        });

        res.json(fileList);
    });
});

app.listen(PORT, () => {
    console.log(`Server run on http://localhost:${PORT}! \nLet's go to work`)
});

// Роут для чтения содержимого файла
// app.get('/file', (req, res) => {
//     const filePath = req.query.path;

//     if (!filePath) {
//         return res.status(400).send('Не указан путь к файлу');
//     }

//     if (!fs.existsSync(filePath)) {
//         return res.status(404).send('Файл не существует');
//     }

//     fs.readFile(filePath, 'utf8', (err, data) => {
//         if (err) {
//             return res.status(500).send('Ошибка при чтении файла');
//         }
//         res.json({ content: data });
//     });
// });

// // Роут для сохранения изменений в файле
// app.post('/file', (req, res) => {
//     const filePath = req.body.path;
//     const content = req.body.content;

//     if (!filePath || !content) {
//         return res.status(400).send('Не указан путь к файлу или содержимое');
//     }

//     fs.writeFile(filePath, content, 'utf8', (err) => {
//         if (err) {
//             return res.status(500).send('Ошибка при сохранении файла');
//         }
//         res.send('Файл успешно сохранен');
//     });
// });

// // Роут для удаления файла
// app.delete('/file', (req, res) => {
//     const filePath = req.body.path;

//     if (!filePath) {
//         return res.status(400).send('Не указан путь к файлу');
//     }

//     if (!fs.existsSync(filePath)) {
//         return res.status(404).send('Файл не существует');
//     }

//     fs.unlink(filePath, (err) => {
//         if (err) {
//             return res.status(500).send('Ошибка при удалении файла');
//         }
//         res.send('Файл успешно удален');
//     });
// });