import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { Location, TargetMode } from '../../../Constants.js';
import { countCardsUnderneath } from '../../cardsUnderneath.js';

class Stowaway extends DrawCard {
    static id = 'stowaway';

    setupCardAbilities() {
        this.reaction('Place cards underneath self')
            .when({
                onConflictDeclared: (event, context) => !!event.attackers?.includes(context.source),
                onDefendersDeclared: (event, context) => event.defenders.includes(context.source),
                onCharacterEntersPlay: (event, context) => event.card === context.source && context.source.isParticipating()
            })
            .targetCards({
                location: [Location.DynastyDiscardPile, Location.ConflictDiscardPile],
                mode: TargetMode.UpTo,
                numCards: 2,
                activePromptTitle: 'Choose up to 2 cards in a discard pile',
                sameDiscardPile: true
            }, AbilityDsl.actions.placeCardUnderneath({ destination: this }))
            .effect('place {0} beneath {1}', context => [context.source]);

        this.persistentEffect({
            effect: AbilityDsl.effects.modifyMilitarySkill(() => Math.floor(countCardsUnderneath(this) / 2))
        });
    }
}


export default Stowaway;
