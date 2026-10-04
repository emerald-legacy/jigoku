import { CardType, Duration, EventName } from '../../Constants.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import AbilityDsl from '../../abilitydsl.js';
import type BaseCard from '../../BaseCard.js';
import DrawCard from '../../DrawCard.js';
import type { EventPayload } from '../../Events/EventPayloads.js';

export default class RisingStarsKata extends DrawCard {
    static id = 'rising-stars-kata';

    private duelWinnersThisConflict = new Set<BaseCard>();

    public setupCardAbilities() {
        new EventRegistrar(this.game, this).register([EventName.OnConflictFinished, EventName.AfterDuel]);

        this.action('Give a participating unique character +3 military skill')
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card) => card.isUnique() && card.isParticipating()
            }, AbilityDsl.actions.cardLastingEffect((context) => ({
                duration: Duration.UntilEndOfConflict,
                effect: context.target && this.duelWinnersThisConflict.has(context.target)
                    ? AbilityDsl.effects.modifyMilitarySkill(5)
                    : AbilityDsl.effects.modifyMilitarySkill(3)
            })))
            .effect('give {0} +{1} {2} skill until the end of the conflict', (context) => [this.duelWinnersThisConflict.has(context.target) ? 5 : 3, 'military'])
            .max(AbilityDsl.limit.perConflict(1));
    }

    public onConflictFinished() {
        this.duelWinnersThisConflict.clear();
    }

    public afterDuel(event: EventPayload<EventName.AfterDuel>) {
        for(const winner of event.duel.winner ?? []) {
            this.duelWinnersThisConflict.add(winner);
        }
    }
}
