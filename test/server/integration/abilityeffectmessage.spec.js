describe('ability effect message', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['ikoma-ikehata', 'doji-hotaru'],
                    conflictDeck: ['fine-katana', 'ornate-fan']
                },
                player2: {
                    inPlay: ['miya-mystic']
                }
            });
            this.ikehata = this.player1.findCardByName('ikoma-ikehata');
            this.hotaru = this.player1.findCardByName('doji-hotaru');
            this.mystic = this.player2.findCardByName('miya-mystic');
            this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');
            this.noMoreActions();
        });

        it('names every game action of the ability', function() {
            this.player1.clickRing('air');
            this.player1.clickRing('air');
            this.player1.clickCard(this.shamefulDisplay);
            this.player1.clickCard(this.ikehata);
            this.player1.clickPrompt('Initiate Conflict');
            this.player1.clickPrompt('No Target');
            this.player2.clickCard(this.mystic);
            this.player2.clickPrompt('Done');
            this.noMoreActions();
            this.player1.clickCard(this.ikehata);
            this.player1.clickCard(this.hotaru);
            expect(this.getChatLogs(5)).toContain('player1 uses Ikoma Ikehata to honor Doji Hotaru and draw 1 card');
        });
    });
});

describe('Playing an event set aside by Stolen Secrets', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['favored-niece', 'soshi-illusionist'],
                    hand: ['stolen-secrets']
                },
                player2: {
                    hand: ['assassination', 'finger-of-jade', 'tattooed-wanderer', 'kami-unleashed', 'censure']
                }
            });
            this.assassination = this.player2.findCardByName('assassination', 'hand');
            for(const name of ['censure', 'assassination', 'finger-of-jade', 'tattooed-wanderer', 'kami-unleashed']) {
                this.player2.player.moveCard(this.player2.findCardByName(name, 'hand'), 'conflict deck');
            }
            this.favoredNiece = this.player1.findCardByName('favored-niece');
            this.favoredNiece.fate = 2;
            this.soshiIllusionist = this.player1.findCardByName('soshi-illusionist');
            this.stolenSecrets = this.player1.findCardByName('stolen-secrets');

            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.favoredNiece, this.soshiIllusionist],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.stolenSecrets);
            this.player1.clickCard(this.favoredNiece);
            this.player1.clickPrompt('Assassination');
            this.player1.clickPrompt('Tattooed Wanderer');
            this.player1.clickPrompt('Finger of Jade');
            expect(this.assassination.location).toBe('removed from game');
            this.player2.pass();
        });

        it('names the card that set it aside', function () {
            this.player1.clickCard(this.assassination);
            this.player1.clickCard(this.soshiIllusionist);
            expect(this.assassination.location).toBe('conflict discard pile');
            const logs = this.getChatLogs(10);
            expect(logs).toContain('player1 plays Assassination from the cards set aside by Stolen Secrets');
            expect(logs.some((line) => line.includes('removed from game'))).toBe(false);
        });
    });
});
