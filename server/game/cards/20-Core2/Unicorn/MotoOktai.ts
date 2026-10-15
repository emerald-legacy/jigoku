import { CardType, Duration, Location, Phase, Players } from '../../../Constants.js';
import { modifyMilitarySkill } from '../../../effects.js';
import { discardFromPlay } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

function skillBonus(card: DrawCard) {
    return card.militarySkill;
}

export default class MotoOktai extends DrawCard {
    static id = 'moto-oktai';

    override setupCardAbilities() {
        this.interrupt('Increase this character\'s skill')
            .when({
                onCardLeavesPlay: ({ card }, context) =>
                    context.game.currentPhase === Phase.Conflict && card.location === Location.PlayArea && card.type === CardType.Character
            })
            .cardLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                effect: modifyMilitarySkill(skillBonus(context.event.card))
            }))
            .chatText((context) => msg`get +${skillBonus(context.event.card)} ${'military'} for this phase - he is emboldened by justice, but unburdened by mercy`);

        this.conflictAction('Discard a character from play')
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, discardFromPlay())
            .chatText((context) => msg`discard ${context.target} - purge the weak`);
    }
}
