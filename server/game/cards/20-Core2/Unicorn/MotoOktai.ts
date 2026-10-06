import { CardType, Duration, Location, Players } from '../../../Constants.js';
import { modifyMilitarySkill } from '../../../effects.js';
import { cardLastingEffect, discardFromPlay } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

function skillBonus(card: DrawCard) {
    return card.getMilitarySkill();
}

export default class MotoOktai extends DrawCard {
    static id = 'moto-oktai';

    setupCardAbilities() {
        this.interrupt('Increase this character\'s skill')
            .when({
                onCardLeavesPlay: ({ card }, _context) =>
                    card.location === Location.PlayArea && card.type === CardType.Character
            })
            .gameAction(cardLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                effect: modifyMilitarySkill(skillBonus(context.event.card))
            })))
            .effect('get +{1} {2} for this phase - he is emboldened by justice, but unburdened by mercy', (context) => [skillBonus(context.event.card), 'military']);

        this.action('Discard a character from play')
            .condition((context) => context.source.isParticipatingFor(context.player))
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, discardFromPlay())
            .effect((context) => msg`discard ${context.target} - purge the weak`);
    }
}
