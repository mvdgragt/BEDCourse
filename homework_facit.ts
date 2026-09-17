import express, { Request, Response } from "express";
const app = express();
const PORT = 3000;

app.use(express.json());

type Party = {
  id: string;
  name: string;
  leader: string;
  seats: number;
};

type PartyParams = { id: string };

let parties: Party[] = [
  {
    id: "1",
    name: "Socialdemokraterna",
    leader: "Magdalena Andersson",
    seats: 99,
  },
  { id: "2", name: "Moderaterna", leader: "Ulf Kristersson", seats: 70 },
  { id: "3", name: "Sverigedemokraterna", leader: "Jimmie Åkesson", seats: 62 },
  { id: "4", name: "Vänsterpartiet", leader: "Nooshi Dadgostar", seats: 30 },
  {
    id: "5",
    name: "Centerpartiet",
    leader: "Elisabeth Thand Ringqvist",
    seats: 25,
  },
  { id: "6", name: "Kristdemokraterna", leader: "Ebba Busch", seats: 22 },
  { id: "7", name: "Miljöpartiet", leader: "Daniel Helldén", seats: 22 },
  { id: "8", name: "Liberalerna", leader: "Simona Mohamsson", seats: 19 },
];

// --- Task 8 ---

app.get(
  "/parties/seats-total",
  (req: Request, res: Response) => {
    const totalSeats: number = parties.reduce((total, party) => {
      return total + party.seats;
    }, 0);
    res.json({ totalSeats: totalSeats });
  },
  // parties.map((party) => {
  //   totalSeats.(party.seats));
);

// --- Task 1 ---

app.get("/parties", (req: Request, res: Response): void => {
  res.json(parties);
});

// --- Task 2 --- Task 7 ---

app.post("/parties", (req: Request, res: Response): void => {
  const newParty: Party = {
    id: crypto.randomUUID(),
    name: req.body.name,
    leader: req.body.leader,
    seats: req.body.seats,
  };
  if (newParty.name && newParty.leader && newParty.seats) {
    parties.push(newParty);
    res.status(201).json({ message: "new party added: ", newParty });
    return;
  }
  res.status(400).json({
    message:
      "no new party added, check whether you entered the party's name, leader and amount of seats and try again...",
  });
});

// --- Task 4 ---

app.put("/parties/:id", (req: Request<PartyParams>, res: Response): void => {
  const partyId: string = req.params.id;
  const party = parties.find((p) => p.id === partyId);

  if (!party) {
    res.status(404).json({ message: "no party found to update..." });
    return;
  }

  party.name = req.body.name ?? party.name;
  party.leader = req.body.leader ?? party.leader;
  party.seats = req.body.seats ?? party.seats;
  res.json({ message: "Party updated successfully", party });
});

// --- Task 5 ---

// Remove a party
app.delete("/party/:id", (req: Request<PartyParams>, res: Response) => {
  const partyId: string = req.params.id;
  parties = parties.filter((p) => p.id !== partyId);
  res.json({ message: "Party deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
