import DrawCard from '../../drawcard.js';
import { CardTypes, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class CelebratedRenown extends DrawCard {
    static id = 'celebrated-renown';

    setupCardAbilities() {
        this.action({
            title: 'Honor a character',
            target: {
                controller: Players.Any,
                cardType: CardTypes.Character,
                cardCondition: (card, context) => {
                    let charactersInPlay = context.game.findAnyCardsInPlay(c => c.type === CardTypes.Character);
                    return card.getFate() === Math.max(...charactersInPlay.map(c => c.getFate()));
                },
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}


export default CelebratedRenown;
