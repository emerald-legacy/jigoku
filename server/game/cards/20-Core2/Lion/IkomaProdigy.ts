import { gainHonor } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class IkomaProdigy extends DrawCard {
    static id = 'ikoma-prodigy';

    setupCardAbilities() {
        this.reaction('Gain 1 honor')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source && context.source.fate > 0,
                onMoveFate: (event, context) => event.recipient === context.source && (event.fate ?? 0) > 0
            })
            .gameAction(gainHonor());
    }
}
