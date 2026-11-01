import { msg } from '../../../GameChat.js';
import type Player from '../../../Player.js';
import DrawCard from '../../../DrawCard.js';
import * as costs from '../../../costs/index.js';
import { perConflict } from '../../../AbilityLimit.js';
import { modifyBothSkills } from '../../../effects.js';
import { Location, Trait, isFactionName } from '../../../Constants.js';
import type BaseCard from '../../../BaseCard.js';

export default class PurveyorOfRarities extends DrawCard {
    static id = 'purveyor-of-rarities';

    override setupCardAbilities() {
        this.conflictAction('Discard a card for bonuses')
            .cost(costs.discardCard({ location: Location.Hand }))
            .if((context) => this.cardCondition(context.costs.discardCard, context.player))
                .cardLastingEffect((context) => ({ target: context.source, effect: modifyBothSkills(1) }))
                .gainFate(1)
            .otherwise()
                .cardLastingEffect((context) => ({ target: context.source, effect: modifyBothSkills(3) }))
            .chatText((context) => this.cardCondition(context.costs.discardCard, context.player)
                ? msg`give +${1}${'military'}/+${1}${'political'} to ${context.source}${' and gain 1 fate'}`
                : msg`give +${3}${'military'}/+${3}${'political'} to ${context.source}`)
            .max(perConflict(1));
    }

    private cardCondition(discarded: BaseCard | BaseCard[] | undefined, player: Player) {
        if(!discarded) {
            return false;
        }
        const card = Array.isArray(discarded) ? discarded[0] : discarded;
        return card.hasTrait(Trait.Foreign) || this.isOutOfClan(card, player);
    }

    /** RRG Out-of-clan: no symbol of the clan of its controller's stronghold (without one, the deck's clan). */
    private isOutOfClan(card: BaseCard, player: Player): boolean {
        const clan = player.stronghold ? player.stronghold.printedFaction : player.faction.value;
        return !card.isFaction('neutral') && !(isFactionName(clan) && card.isFaction(clan));
    }
}
