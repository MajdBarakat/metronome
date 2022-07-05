export default ({ tempo }) => {
  //short circut variable assigning
  let marking =
    (tempo < 30 && "Larghissimo") ||
    (30 <= tempo && tempo <= 50 && "Lento") ||
    (50 < tempo && tempo <= 73 && "Adagio") ||
    (73 < tempo && tempo <= 86 && "Andante") ||
    (86 < tempo && tempo <= 109 && "Moderato") ||
    (109 < tempo && tempo <= 132 && "Allegro") ||
    (132 < tempo && tempo <= 150 && "Vivace") ||
    (150 < tempo && tempo <= 200 && "Presto") ||
    (200 < tempo && "Pretissimo");

  return <h3>{marking}</h3>;
};
