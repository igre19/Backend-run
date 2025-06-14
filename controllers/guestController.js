import { Console } from "console";
import db from "../src/db.js";
const guestsCollection = db.collection("users");
import { ObjectId } from "mongodb";

// Ispisivanje svih korisnika
export const getAllGuests = async (req, res) => {
  try {
    const guest = await guestsCollection.find().toArray();
    res.json(guest);
  } catch (error) {
    console.error("Greška pri dohvaćanju gostiju:", error.message);
    res.status(500).json({ error: error.message });
  }
};

//Traženje samo jednog gosta
export const getGuestById = async (req, res) => {
  const guestId = req.params.id;
  try {
    const guest = await guestsCollection.findOne({
      _id: new ObjectId(guestId),
    });
    if (!guest) {
      return res.status(404).json({ message: "Odabrani gost nije pronađen." });
    }
    res.json(guest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getGuestByEmail = async (req, res) => {
  const guestEmail = req.params.email;
  try {
    const guest = await guestsCollection.findOne({
      email: guestEmail,
    });
    if (!guest) {
      return res.status(404).json({ message: "Odabrani gost nije pronađen." });
    }
    res.json(guest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dodavanje novog gosta
export const newGuest = async (req, res) => {
  const { id, firstName, secondName, dateOfBirth, role, email, password } =
    req.body;
  try {
    const result = await guestsCollection.insertOne({
      id,
      firstName,
      secondName,
      dateOfBirth,
      role,
      email,
      password,
    });
    res
      .status(201)
      .json({ message: "Gost je uspješno dodan.", id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const changeEmail = async (req, res) => {
  const guestId = req.body._id;
  const guestEmail = req.body.email;
  const guestUsername = req.body.username;

  try {
    const result = await guestsCollection.updateOne(
      { _id: new ObjectId(guestId) },
      {
        $set: {
          email: guestEmail,
          username: guestUsername,
        },
      }
    );
    res.status(201).json({ message: "Gost je updatan " });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Brisanje samo jednog gosta
export const deleteGuest = async (req, res) => {
  const guestId = req.params.id;
  try {
    const result = await guestsCollection.deleteOne({
      id: guestId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Guest not found." });
    }

    res.json({ message: "Gost je uspješno obrisan!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const guestMethods = {
  getAllGuests,
  getGuestById,
  getGuestByEmail,
  newGuest,
  deleteGuest,
  changeEmail,
};
