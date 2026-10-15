import { addTrait, modifyBothSkills } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import { CardType, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class KakitaMio extends DrawCard {
    static id = 'kakita-mio';

    override setupCardAbilities() {
        this.tutored('Writ of Sanctification');

        this.conflictAction('Give Corrupt to a character', { evenFromHome: true })
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card.isParticipating() &&
                    context.game.currentConflict?.getNumberOfParticipantsFor(card.controller) === 1
            }, cardLastingEffect({
                effect: addTrait(Trait.Shadowlands)
            }));

        this.persistentEffect({
            condition: (context) =>
                !!context.game.currentConflict &&
                context.game.currentConflict.getNumberOfParticipantsFor(context.player.opponent, (card) => (card.hasTrait(Trait.Shadowlands) || card.isTainted)) > 0,
            match: (card, context) =>
                card.type === CardType.Character &&
                !!context && card.isParticipatingFor(context.player) &&
                (card.hasTrait(Trait.Imperial) || card.attachments.some((attachment) => attachment.hasTrait(Trait.Imperial))),
            effect: modifyBothSkills(1)
        });
    }
}
