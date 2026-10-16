// Locations follow the source supplied by the user. The illustrated search
// scenes are playful interpretations, not architectural reconstructions.
export const stages = [
  { name:'Zamek Książąt Lubomirskich', short:'Lubniewice', subtitle:'Lubniewice · zamek wśród jezior', type:'castle', fact:'Lubniewice to początek naszej wirtualnej wyprawy. Tutejszy zamek otaczają lasy i jeziora. Które z tych miejsc odwiedzisz z rodziną?', intro:'Czapka na głowę, paszport w dłoń! Zaczynamy przy zamku w Lubniewicach.', object:{id:'boat',name:'Żaglówka',riddle:'Nie mam nóg, a po wodzie mknę. Wiatr napełnia mój biały brzuch. Czym jestem?',hint:'Popatrz na jezioro. Szukaj białego żagla w kształcie trójkąta.'}},
  { name:'Zamek Piastowski', short:'Międzyrzecz', subtitle:'Międzyrzecz · śladami dawnych murów', type:'ruins', fact:'W Międzyrzeczu można odkrywać historię średniowiecznego zamku i Muzeum Ziemi Międzyrzeckiej im. Alfa Kowalskiego.', intro:'Te mury pamiętają dawne czasy. Czy znajdziesz przedmiot z mojej zagadki?', object:{id:'key',name:'Klucz',riddle:'Nie mam ręki, a zamek otwieram. Ząbki mam, lecz niczego nie zjadam. Czym jestem?',hint:'Przyjrzyj się ziemi obok ścieżki prowadzącej do bramy.'}},
  { name:'Zamek Joannitów', short:'Łagów', subtitle:'Łagów · pomiędzy dwoma jeziorami', type:'tower', fact:'Zamek Joannitów w Łagowie stoi pomiędzy dwoma jeziorami. Dawniej był siedzibą zakonu joannitów.', intro:'W Łagowie zamek zagląda w taflę jeziora. A co tańczy wysoko nad nim?', object:{id:'flag',name:'Flaga',riddle:'Na wysokim maszcie tańczę z wiatrem. Z daleka pokażę, gdzie jest zamek. Czym jestem?',hint:'Spójrz na samą górę zamkowej wieży.'}},
  { name:'Pałac w Zaborze', short:'Zabór', subtitle:'Zabór · pałacowe opowieści', type:'palace', fact:'W Zaborze na szlaku Duszka czeka pałac. Przyjrzyj się jego fasadzie: ile okien zdołasz wypatrzyć?', intro:'Czas na spacer przy pałacu. Wśród kwiatów ukrył się mały, skrzydlaty gość.', object:{id:'butterfly',name:'Motyl',riddle:'Mam kolorowe skrzydła, ale nie jestem ptakiem. Z kwiatu na kwiat fruwam nad pałacowym trawnikiem. Kim jestem?',hint:'Spójrz na kwiaty po lewej stronie obrazka.'}},
  { name:'Park Książęcy w Zatoniu', short:'Zatonie', subtitle:'Zielona Góra · parkowe sekrety', type:'park', fact:'Zatonie jest dziś częścią Zielonej Góry. W Parku Książęcym można spacerować wśród zieleni i zobaczyć ruiny pałacu.', intro:'W parku w Zatoniu odpoczywa się wspaniale. Słyszysz ten cichy plusk?', object:{id:'fountain',name:'Fontanna',riddle:'Nie jestem deszczem, a wodą pryskam. Z kamiennej misy w górę wytryskam. Czym jestem?',hint:'Poszukaj kamiennej misy z wodą, po prawej stronie parkowej alejki.'}},
  { name:'Zamek Piastowski', short:'Kożuchów', subtitle:'Kożuchów · zamek pełen kultury', type:'culture', fact:'W zamku w Kożuchowie działa Centrum Kultury „Zamek”. Zabytki mogą być miejscem spotkań, zabawy i poznawania historii!', intro:'Ten zamek lubi opowieści. Jedna z nich czeka na Ciebie na ławce.', object:{id:'book',name:'Książka',riddle:'Mam kartki, lecz nie jestem zeszytem. Otwórz mnie, a zabiorę Cię w świat opowieści. Czym jestem?',hint:'Spójrz na ławkę po prawej stronie. Leży na niej coś otwartego.'}},
  { name:'Pałac Książęcy', short:'Żagań', subtitle:'Żagań · wielka pałacowa przygoda', type:'grand-palace', fact:'Pałac Książęcy w Żaganiu to jedna z najokazalszych rezydencji w Lubuskiem. Przy takim budynku nawet Duszek czuje się malutki!', intro:'Tyle okien, tyle tajemnic! Tym razem odpowiedź znajdziesz na pałacu.', object:{id:'clock',name:'Zegar',riddle:'Mam tarczę, lecz nie jestem rycerzem. Dwie wskazówki pokazują, kiedy pora na kolejną przygodę. Czym jestem?',hint:'Poszukaj okrągłej tarczy wysoko nad środkowym wejściem.'}},
  { name:'Park Dworski i Pałac', short:'Iłowa', subtitle:'Iłowa · ostatni przystanek szlaku', type:'garden', fact:'Pałac w Iłowej otacza park z ciekawą architekturą ogrodową. Osiem miejsc poznanych w grze może stać się pomysłem na rodzinne wycieczki.', intro:'W Iłowej czeka kolejna zagadka. Zajrzyjmy do pałacowego parku!', object:{id:'bridge',name:'Mostek',riddle:'Łączę dwa brzegi, choć nie umiem pływać. Możesz po mnie przejść suchą stopą nad wodą. Czym jestem?',hint:'Popatrz na strumień w dolnej części obrazka. Co prowadzi na drugi brzeg?'}}
];

export const freshState = () => ({ version:2, stage:0, progress:Array(stages.length).fill(0) });
export const totalFound = state => state.progress.reduce((a,b)=>a+b,0);
export function restoreState(value) {
  try {
    const s=JSON.parse(value);
    if (s?.version!==2 || !Number.isInteger(s.stage) || s.stage<0 || s.stage>=stages.length || !Array.isArray(s.progress) || s.progress.length!==stages.length || !s.progress.every(n=>n===0||n===1)) return freshState();
    return {version:2,stage:s.stage,progress:[...s.progress]};
  } catch { return freshState(); }
}
export function discover(state,id) {
  if (state.progress[state.stage] || stages[state.stage].object.id!==id) return false;
  state.progress[state.stage]=1;
  return true;
}
export function nextUnvisited(state) {
  for(let offset=1;offset<=stages.length;offset++) {
    const index=(state.stage+offset)%stages.length;
    if (!state.progress[index]) return index;
  }
  return null;
}
