import DrawCard from '../../DrawCard.js';

class AkodoGunso extends DrawCard {
    static id = 'akodo-gunso';

    setupCardAbilities() {
        this.reaction('Refill province faceup')
            .when({
                onCharacterEntersPlay: (event, context) =>
                    event.card === context.source &&
                    context.game.getProvinceArray().includes(event.originalLocation)
            })
            .refillFaceup((context) => ({ location: context.event.originalLocation }));
    }
}


export default AkodoGunso;
