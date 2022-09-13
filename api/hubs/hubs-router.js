const express = require('express');

const Hubs = require('./hubs-model.js');
const Messages = require('../messages/messages-model.js');
const { checklist, checkHub } = require('./hubs-middleware.js');

const router = express.Router();

router.get('/', (req, res, next) => {
  Hubs.find(req.query)
    .then(hubs => {
      res.status(200).json(hubs);
    })
    .catch(next);
});

router.get('/:id', checklist, (req, res, next) => {
  Hubs.findById(req.params.id)
    .then(hub => {
      if (hub) {
        res.status(200).json(hub);
      } else {
        res.status(404).json({ message: 'Hub not found' });
      }
    })
    .catch(next);
});

router.post('/', checkHub, (req, res, next) => {
  Hubs.add(req.body)
    .then(hub => {
      res.status(201).json(hub);
    })
    .catch(next);
});

router.delete('/:id', checklist, (req, res, next) => {
  Hubs.remove(req.params.id)
    .then(() => {
        res.status(200).json({ message: 'The hub has been nuked' });
    })
    .catch(next);
});

router.put('/:id', checkHub, (req, res, next) => {
  Hubs.update(req.params.id, req.body)
    .then(hub => {
      if (hub) {
        res.status(200).json(hub);
      } else {
        res.status(404).json({ message: 'The hub could not be found' });
      }
    })
    .catch(next);
});

router.get('/:id/messages', (req, res, next) => {
  Hubs.findHubMessages(req.params.id)
    .then(messages => {
      res.status(200).json(messages);
    })
    .catch(next);
});

router.post('/:id/messages', (req, res, next ) => {
  const messageInfo = { ...req.body, hub_id: req.params.id };

  Messages.add(messageInfo)
    .then(message => {
      res.status(210).json(message);
    })
    .catch(next)
});

router.use((error, req, res, next)=>{
  res.status(error.status || 500).json({
    message: error.message,
    customMessage: 'something bad happend inside the hubs router',
  });
});

module.exports = router;
