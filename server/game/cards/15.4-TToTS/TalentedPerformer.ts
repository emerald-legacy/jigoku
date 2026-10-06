import DrawCard from '../../DrawCard.js';
import { mustBeChosen } from '../../effects.js';

class TalentedPerformer extends DrawCard {
    static id = 'talented-performer';

    setupCardAbilities() {
        this.persistentEffect({
            effect: mustBeChosen({ restricts: 'events' })
        });
    }
}


export default TalentedPerformer;
