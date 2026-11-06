import DrawCard from '../../DrawCard.js';
import { mustBeChosen } from '../../effects.js';
import { RestrictionScope } from '../../Constants.js';

class TalentedPerformer extends DrawCard {
    static id = 'talented-performer';

    override setupCardAbilities() {
        this.persistentEffect({
            effect: mustBeChosen({ appliesTo: RestrictionScope.Events })
        });
    }
}


export default TalentedPerformer;
