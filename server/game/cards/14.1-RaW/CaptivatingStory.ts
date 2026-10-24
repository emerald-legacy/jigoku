import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { modifyPoliticalSkill } from '../../effects.js';
import { cardLastingEffect, honor, removeFate, resolveAbility } from '../../GameActions/GameActions.js';
import { CardType, EventName, Players } from '../../Constants.js';
import { CardAbility } from '../../CardAbility.js';

class CaptivatingStory extends DrawCard {
    static id = 'captivating-story';

    override setupCardAbilities() {
        this.action('Give a character +X pol')
            .condition((context) => (this.game.currentConflict?.getNumberOfParticipantsFor(context.player) ?? 0) === 1)
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card.isParticipating() && (context.player.getNumberOfFaceupProvinces() > 0 || removeFate().canAffect(card, context))
            }, cardLastingEffect((context) => ({
                effect: modifyPoliticalSkill(context.player.getNumberOfFaceupProvinces())
            })))
            .chatText((context) => msg`give ${context.chatTarget()} +1${'political'} for each faceup province they control (+${context.player.getNumberOfFaceupProvinces()}${'political'})`)
            .optional((context) => ({
                activePromptTitle: 'Remove 1 fate from ' + context.target.name + ' to honor them?',
                required: context.player.getNumberOfFaceupProvinces() === 0,
                acceptMessage: () => msg`${context.player} chooses to remove a fate from ${context.target} to honor them`,
                declineMessage: () => msg`${context.player} chooses not to remove a fate from ${context.target} to honor them`,
                gameAction: removeFate({ target: context.target })
            }))
            .thenIf((context) => context.events.some((event) => event.name === EventName.OnMoveFate && event.isFullyResolved()))
            .gameAction(resolveAbility((context) => ({
                target: context.source,
                subResolution: true,
                ability: new CardAbility(context.source, {
                    title: 'Honor this character',
                    gameAction: honor({ target: context.target })
                })
            })));
    }
}


export default CaptivatingStory;
