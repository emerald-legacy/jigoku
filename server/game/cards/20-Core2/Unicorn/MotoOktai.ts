import { CardType, Duration, Location, Players } from '../../../Constants.js';
import type BaseCard from '../../../BaseCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

function skillBonus(card: BaseCard) {
    return card.isDrawCard() ? card.getMilitarySkill() : 0;
}

export default class MotoOktai extends DrawCard {
    static id = 'moto-oktai';

    setupCardAbilities() {
        this.interrupt('Increase this character\'s skill')
            .when({
                onCardLeavesPlay: ({ card }, _context) =>
                    card.location === Location.PlayArea && card.type === CardType.Character
            })
            .gameAction(AbilityDsl.actions.cardLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                effect: AbilityDsl.effects.modifyMilitarySkill(skillBonus(context.event.card))
            })))
            .effect('get +{1} {2} for this phase - he is emboldened by justice, but unburdened by mercy!', (context) => [skillBonus(context.event.card), 'military']);

        this.action('Discard a character from play')
            .condition((context) => context.source.isParticipatingFor(context.player))
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self
            }, AbilityDsl.actions.discardFromPlay())
            .effect('discard {1} - purge the weak!', (context) => [context.target ?? '']);
    }
}
