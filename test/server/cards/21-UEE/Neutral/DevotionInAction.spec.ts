describe('Devotion in Action', () => {
    integration(() => {
        let devotionInAction: any;
        let ikomaProdigy: any;
        let masterOfTheSpear: any;
        let matsuBerserker: any;
        let ikomaMessageRunner: any;
        let matsuSakura: any;
        let akodoYoshitsune: any;
        let bayushiManipulator: any;
        let courtNovice: any;
        let player1: any;
        let player2: any;
        let noMoreActions: () => void;
        let initiateConflict: (config: any) => void;
        let getChatLogs: (n: number) => string[];

        beforeEach(function(this: any) {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['devotion-in-action', 'master-of-the-spear'],
                    inPlay: ['ikoma-prodigy'],
                    dynastyDiscard: ['matsu-berserker', 'ikoma-message-runner', 'matsu-sakura', 'akodo-yoshitsune']
                },
                player2: {
                    inPlay: ['bayushi-manipulator', 'court-novice']
                }
            });

            player1 = this.player1;
            player2 = this.player2;
            noMoreActions = () => this.noMoreActions();
            initiateConflict = (config) => this.initiateConflict(config);
            getChatLogs = (n) => this.getChatLogs(n);

            devotionInAction = player1.findCardByName('devotion-in-action');
            ikomaProdigy = player1.findCardByName('ikoma-prodigy');
            masterOfTheSpear = player1.findCardByName('master-of-the-spear');
            matsuBerserker = player1.placeCardInProvince('matsu-berserker', 'province 1');
            ikomaMessageRunner = player1.placeCardInProvince('ikoma-message-runner', 'province 2');
            matsuSakura = player1.placeCardInProvince('matsu-sakura', 'province 3');
            akodoYoshitsune = player1.placeCardInProvince('akodo-yoshitsune', 'province 4');

            bayushiManipulator = player2.findCardByName('bayushi-manipulator');
            courtNovice = player2.findCardByName('court-novice');

            noMoreActions();
        });

        it('does nothing unless outnumbered', () => {
            initiateConflict({
                attackers: [ikomaProdigy],
                defenders: [bayushiManipulator]
            });
            player2.pass();
            player1.clickCard(devotionInAction);
            expect(player1).toHavePrompt('Conflict Action Window');
        });

        it('when outnumbered, chooses a character to put in play', () => {
            initiateConflict({
                attackers: [ikomaProdigy],
                defenders: [bayushiManipulator, courtNovice]
            });
            player2.pass();
            player1.clickCard(devotionInAction);
            expect(player1).toHavePrompt('Devotion in Action');
            expect(player1).toBeAbleToSelect(matsuBerserker);
            expect(player1).toBeAbleToSelect(matsuSakura);
            expect(player1).toBeAbleToSelect(masterOfTheSpear);
            expect(player1).not.toBeAbleToSelect(ikomaMessageRunner);
            expect(player1).not.toBeAbleToSelect(akodoYoshitsune);
        });

        it('the character enters play ordinary unless yojimbo', () => {
            initiateConflict({
                attackers: [ikomaProdigy],
                defenders: [bayushiManipulator, courtNovice]
            });
            player2.pass();
            player1.clickCard(devotionInAction);
            player1.clickCard(matsuBerserker);
            expect(matsuBerserker.location).toBe('play area');
            expect(matsuBerserker.isParticipating()).toBe(true);
            expect(matsuBerserker.isHonored).toBe(false);
            expect(getChatLogs(5)).toContain(
                'player1 plays Devotion in Action to put Matsu Berserker into play in the conflict'
            );
        });

        it('the character enters play honored when yojimbo', () => {
            initiateConflict({
                attackers: [ikomaProdigy],
                defenders: [bayushiManipulator, courtNovice]
            });
            player2.pass();
            player1.clickCard(devotionInAction);
            player1.clickCard(matsuSakura);
            expect(matsuSakura.location).toBe('play area');
            expect(matsuSakura.isParticipating()).toBe(true);
            expect(matsuSakura.isHonored).toBe(true);
            expect(getChatLogs(5)).toContain(
                'player1 plays Devotion in Action to put Matsu Sakura into play in the conflict'
            );
        });

        it('the character stays in play after the conflict ends', () => {
            initiateConflict({
                attackers: [ikomaProdigy],
                defenders: [bayushiManipulator, courtNovice]
            });
            player2.pass();
            player1.clickCard(devotionInAction);
            player1.clickCard(matsuSakura);
            noMoreActions();

            player1.clickPrompt("Don't resolve");
            expect(player1).toHavePrompt('Action Window');
            expect(matsuSakura.location).toBe('play area');
        });
    });
});
