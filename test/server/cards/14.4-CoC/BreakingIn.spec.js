describe('Breaking In', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai', 'doji-whisperer']
                },
                player2: {
                    inPlay: ['tattooed-wanderer'],
                    provinces: ['breaking-in'],
                    dynastyDiscard: [
                        'kakita-toshimoko', 'imperial-storehouse', 'favorable-ground', 'mirumoto-raitsugu',
                        'moto-chagatai', 'akodo-gunso', 'border-rider', 'hida-guardian', 'kitsu-spiritcaller'
                    ]
                }
            });

            this.brashSamurai = this.player1.findCardByName('brash-samurai');
            this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');

            this.tattooedWanderer = this.player2.findCardByName('tattooed-wanderer');
            this.breaking = this.player2.findCardByName('breaking-in');
            this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 2');
            // 9 cards: the 9th (Kakita Toshimoko) is below the 8 Breaking In searches
            this.player2.reduceDeckToNumber('dynasty deck', 0);
            this.toshimoko = this.player2.moveCard('kakita-toshimoko', 'dynasty deck');
            for(const card of ['imperial-storehouse', 'favorable-ground', 'mirumoto-raitsugu', 'moto-chagatai', 'akodo-gunso', 'border-rider', 'hida-guardian', 'kitsu-spiritcaller']) {
                this.player2.moveCard(card, 'dynasty deck');
            }
            this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
            this.chagatai = this.player2.findCardByName('moto-chagatai');
        });

        it('should trigger when revealed', function() {
            this.noMoreActions();
            this.player1.clickCard(this.brashSamurai);
            this.player1.clickRing('fire');
            this.player1.clickCard(this.breaking);
            this.player1.clickPrompt('Initiate Conflict');
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.breaking);
        });

        it('should prompt to choose a character', function() {
            this.noMoreActions();
            this.player1.clickCard(this.brashSamurai);
            this.player1.clickRing('fire');
            this.player1.clickCard(this.breaking);
            this.player1.clickPrompt('Initiate Conflict');
            this.player2.clickCard(this.breaking);
            expect(this.getChatLogs(1)).toContain('player2 uses Breaking In to choose a character to place in a province');
            expect(this.player2).toHavePrompt('Select a card:');
            expect(this.player2).toHavePromptButton('Mirumoto Raitsugu');
            expect(this.player2).toHavePromptButton('Moto Chagatai');
            expect(this.player2).toHavePromptButton('Akodo Gunsō');
            expect(this.player2).toHavePromptButton('Border Rider');
            expect(this.player2).toHavePromptButton('Hida Guardian');
            expect(this.player2).toHavePromptButton('Kitsu Spiritcaller');
            expect(this.player2).not.toHavePromptButton('Imperial Storehouse');
            expect(this.player2).not.toHavePromptButton('Kakita Toshimoko');
            expect(this.player2).toHavePromptButton('Take nothing');
        });

        it('should place nothing and shuffle if \'Take nothing\' is chosen', function() {
            const dynastyDeckSize = this.player2.dynastyDeck.length;
            this.noMoreActions();
            this.player1.clickCard(this.brashSamurai);
            this.player1.clickRing('fire');
            this.player1.clickCard(this.breaking);
            this.player1.clickPrompt('Initiate Conflict');
            this.player2.clickCard(this.breaking);
            this.player2.clickPrompt('Take nothing');
            expect(this.player2.dynastyDeck.length).toBe(dynastyDeckSize);
            expect(this.toshimoko.location).toBe('dynasty deck');
            expect(this.getChatLogs(3)).toContain('player2 selects nothing from their deck');
            expect(this.getChatLogs(3)).toContain('player2 is shuffling their dynasty deck');
        });

        it('if Cavalry, should let you pick the province', function() {
            this.noMoreActions();
            const cardsInDiscard = this.player2.player.dynastyDiscardPile.length;
            this.player1.clickCard(this.brashSamurai);
            this.player1.clickRing('fire');
            this.player1.clickCard(this.breaking);
            this.player1.clickPrompt('Initiate Conflict');
            this.player2.clickCard(this.breaking);
            this.player2.clickPrompt('Moto Chagatai');
            expect(this.player2).toHavePrompt('Choose a province');
            this.player2.clickCard(this.shamefulDisplay);
            expect(this.chagatai.location).toBe('province 2');
            expect(this.chagatai.facedown).toBe(false);
            expect(this.player2.player.dynastyDiscardPile.length).toBe(cardsInDiscard);
            expect(this.getChatLogs(3)).toContain('player2 places Moto Chagatai in province 2');
            expect(this.getChatLogs(3)).toContain('player2 is shuffling their dynasty deck');
            expect(this.toshimoko.location).toBe('dynasty deck');
        });

        it('if not Cavalry, should not let you pick the province', function() {
            this.noMoreActions();
            const cardsInDiscard = this.player2.player.dynastyDiscardPile.length;
            this.player1.clickCard(this.brashSamurai);
            this.player1.clickRing('fire');
            this.player1.clickCard(this.breaking);
            this.player1.clickPrompt('Initiate Conflict');
            this.player2.clickCard(this.breaking);
            this.player2.clickPrompt('Mirumoto Raitsugu');
            expect(this.mirumotoRaitsugu.location).toBe('province 1');
            expect(this.mirumotoRaitsugu.facedown).toBe(false);
            expect(this.player2.player.dynastyDiscardPile.length).toBe(cardsInDiscard);
            expect(this.getChatLogs(3)).toContain('player2 places Mirumoto Raitsugu in Breaking In');
            expect(this.getChatLogs(3)).toContain('player2 is shuffling their dynasty deck');
        });
    });
});
