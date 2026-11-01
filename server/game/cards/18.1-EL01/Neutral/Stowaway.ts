import { msg } from '../../../GameChat.js';
import DrawCard from '../../../DrawCard.js';
import { modifyMilitarySkill } from '../../../effects.js';
import { placeCardUnderneath } from '../../../GameActions/GameActions.js';
import { Location, TargetMode } from '../../../Constants.js';
import { countCardsUnderneath } from '../../cardsUnderneath.js';

class Stowaway extends DrawCard {
    static id = 'stowaway';

    override setupCardAbilities() {
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
            }, placeCardUnderneath((context) => ({ destination: context.source })))
            .chatText((context) => msg`place ${context.chatTarget()} beneath ${context.source}`);

        this.persistentEffect({
            effect: modifyMilitarySkill((card) => Math.floor(countCardsUnderneath(card) / 2))
        });
    }
}


export default Stowaway;
