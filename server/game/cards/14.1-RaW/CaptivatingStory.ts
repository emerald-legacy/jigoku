import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { modifyPoliticalSkill } from '../../effects.js';
import {
    cardLastingEffect,
    honor,
    joint,
    menuPrompt,
    removeFate,
    resolveAbility,
    sequential
} from '../../GameActions/GameActions.js';
import { CardType, Players } from '../../Constants.js';
import { CardAbility } from '../../CardAbility.js';

class CaptivatingStory extends DrawCard {
    static id = 'captivating-story';

    setupCardAbilities() {
        this.action('Give a character +X pol')
            .condition((context) => (this.game.currentConflict?.getNumberOfParticipantsFor(context.player) ?? 0) === 1)
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card.isParticipating() && (context.player.getNumberOfFaceupProvinces() > 0 || card.allowGameAction('removeFate', context))
            }, sequential([
                cardLastingEffect((context) => ({
                    effect: modifyPoliticalSkill(context.player.getNumberOfFaceupProvinces())
                })),
                menuPrompt((context) => ({
                    activePromptTitle: 'Remove 1 fate from ' + context.target.name + ' to honor them?',
                    choices: ['Yes'].concat(context.player.getNumberOfFaceupProvinces() > 0 ? ['No'] : []),
                    choiceHandler: (choice, displayMessage) => {
                        if(displayMessage) {
                            context.game.addMessage(msg`${context.player} chooses ${choice === 'No' ? 'not ' : ''}to remove a fate from ${context.target} to honor them`);
                        }
                        return { amount: choice === 'Yes' ? 1 : 0 };
                    },
                    gameAction: joint([
                        removeFate((context) => ({
                            target: context.target
                        })),
                        resolveAbility({
                            target: context.source,
                            subResolution: true,
                            ability: new CardAbility(context.source, {
                                title: 'Honor this character',
                                gameAction: honor({ target: context.target })
                            })
                        })
                    ])
                }))
            ]))
            .chatText((context) => msg`give ${context.chatTarget()} +1${'political'} for each faceup province they control (+${context.player.getNumberOfFaceupProvinces()}${'political'})`);
    }
}


export default CaptivatingStory;
