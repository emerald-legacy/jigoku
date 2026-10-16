describe('Landfall', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai']
                },
                player2: {
                    provinces: ['landfall', 'manicured-garden', 'endless-plains', 'fertile-fields'],
                    dynastyDiscard: ['doji-whisperer', 'kakita-yoshi', 'kakita-toshimoko', 'daidoji-kageyu', 'moto-chagatai',
                        'favorable-ground', 'imperial-storehouse', 'iron-mine', 'aranat']
                }
            });

            this.brashSamurai = this.player1.findCardByName('brash-samurai');

            this.player2.reduceDeckToNumber('dynasty deck', 0);
            this.dojiWhisperer = this.player2.moveCard('doji-whisperer', 'dynasty deck');
            this.yoshi = this.player2.moveCard('kakita-yoshi', 'dynasty deck');
            this.toshimoko = this.player2.moveCard('kakita-toshimoko', 'dynasty deck');
            this.kageyu = this.player2.moveCard('daidoji-kageyu', 'dynasty deck');
            this.chagatai = this.player2.moveCard('moto-chagatai', 'dynasty deck');
            this.favorable = this.player2.moveCard('favorable-ground', 'dynasty deck');
            this.storehouse = this.player2.moveCard('imperial-storehouse', 'dynasty deck');
            this.mine = this.player2.moveCard('iron-mine', 'dynasty deck');
            this.aranat = this.player2.moveCard('aranat', 'dynasty deck');

            this.landfall = this.player2.findCardByName('landfall');
            this.p2 = this.player2.findCardByName('manicured-garden');
            this.p3 = this.player2.findCardByName('endless-plains');
            this.p4 = this.player2.findCardByName('fertile-fields');
            this.pStronghold = this.player2.findCardByName('shameful-display', 'stronghold province');

            this.noMoreActions();
            this.player1.clickCard(this.brashSamurai);
            this.player1.clickRing('fire');
            this.player1.clickCard(this.landfall);
            this.player1.clickPrompt('Initiate Conflict');
        });

        it('should look at the top 8 cards of the dynasty deck', function() {
            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.landfall);
            expect(this.getChatLogs(3)).toContain('player2 uses Landfall to look at the top 8 cards of their dynasty deck');
            expect(this.player2).toHavePrompt('Select a card to place in a province');
            expect(this.player2).not.toHavePromptButton('Doji Whisperer');
            expect(this.player2).toHavePromptButton('Kakita Yoshi');
            expect(this.player2).toHavePromptButton('Aranat');
        });

        it('should put a card faceup into each non-stronghold province, each province once', function() {
            this.player2.clickCard(this.landfall);
            this.player2.clickPrompt('Kakita Yoshi');
            expect(this.player2).toHavePrompt('Choose a province for Kakita Yoshi');
            expect(this.player2).toBeAbleToSelect(this.landfall);
            expect(this.player2).toBeAbleToSelect(this.p2);
            expect(this.player2).not.toBeAbleToSelect(this.pStronghold);
            this.player2.clickCard(this.p2);
            expect(this.yoshi.location).toBe(this.p2.location);
            expect(this.yoshi.facedown).toBe(false);
            expect(this.getChatLogs(1)).toContain('player2 puts Kakita Yoshi into a facedown province');

            this.player2.clickPrompt('Aranat');
            expect(this.player2).not.toBeAbleToSelect(this.p2);
            this.player2.clickCard(this.landfall);
            expect(this.getChatLogs(1)).toContain('player2 puts Aranat into Landfall');

            this.player2.clickPrompt('Iron Mine');
            this.player2.clickCard(this.p3);
            this.player2.clickPrompt('Moto Chagatai');
            this.player2.clickCard(this.p4);

            expect(this.aranat.location).toBe(this.landfall.location);
            expect(this.mine.location).toBe(this.p3.location);
            expect(this.chagatai.location).toBe(this.p4.location);
            expect(this.player2).not.toHavePrompt('Select a card to place in a province');
            expect(this.dojiWhisperer.location).toBe('dynasty deck');
        });
    });
});
