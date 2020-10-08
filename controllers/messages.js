const Message = require("../models/message");

const getChat = async (req, res) => {

  const myId = req.uid;

  const messageFrom = req.params.from;

    const lastMessages = await Message.find({
        $or: [{from: myId, to: messageFrom } , {from: messageFrom , to: myId}]
    })
    .sort({createdAt : 'desc'});


  res.json({ ok: true, messages: lastMessages  });
};

module.exports = {
  getChat,
};
