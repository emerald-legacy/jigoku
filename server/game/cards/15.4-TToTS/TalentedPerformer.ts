import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class TalentedPerformer extends DrawCard {
    static id = 'talented-performer';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.mustBeChosen({ restricts: 'events' })
        });
    }
}


export default TalentedPerformer;
