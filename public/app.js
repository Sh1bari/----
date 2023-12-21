const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());

const messageMap = new Map();

// Эндпоинт, который возвращает "Hello, World!"
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Эндпоинт для открытия HTML-файла
app.get('/clientSender', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'clientSender.html'));
});

app.get('/clientConsumer', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'clientConsumer.html'));
});

// Статическая маршрутизация для обслуживания файлов из каталога public
app.use(express.static(path.join(__dirname, 'public')));


app.post('/sendMessage', (req, res) => {
  const receivedData = req.body;
  // Добавьте вашу логику обработки данных от клиента здесь

  const messageNum = receivedData.messageNum;
  const messageList = receivedData.messageList || [];
  messageMap.set(messageNum, messageList);
  console.log(messageMap)
  res.json(receivedData);
});

app.get('/getMessageNums', (req, res) =>{

  const cardInfoArray = [];

  // Проходимся по каждой карточке в messageMap
  messageMap.forEach((list, id) => {
    const cardInfo = {
      id: id,
      amount: list.length,
    };

    cardInfoArray.push(cardInfo);
  });

  res.json(cardInfoArray);
})

app.get('/card/:id', (req, res) => {
  const cardId = parseInt(req.params.id, 10);
  const originalList = messageMap.get(cardId) || [];
  
  // Создаем новый список с шансом 10% потери каждого элемента
  const modifiedList = originalList.filter(() => Math.random() > 0.3);

  res.json({ id: cardId, list: modifiedList });
});

app.delete('/card/:id', (req, res) => {
  const cardId = parseInt(req.params.id, 10);
  messageMap.delete(cardId);
  console.log('Удалено')

  res.json('Удалено');
});


// Запуск сервера
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
